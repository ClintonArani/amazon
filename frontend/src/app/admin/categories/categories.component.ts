import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  categoryForm!: FormGroup;
  categories: any[] = [];
  isEditMode = false;
  selectedCategory: any = null;
  isModalOpen = false;
  successMessage: string | null = null;
  showConfirmation: boolean = false;
  categoryToDelete: any = null;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;

  constructor(private fb: FormBuilder, private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
  }

  // Initialize the form
  initializeForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  // Load all categories
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (response) => {
        this.categories = response.categories; // Assuming the API returns { categories: [] }
        this.calculateTotalPages(); // Calculate total pages after loading categories
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  // Calculate total pages based on the number of categories
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.categories.length / this.itemsPerPage);
  }

  // Get categories for the current page
  getPaginatedCategories(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.categories.slice(startIndex, endIndex);
  }

  // Open modal for adding a new category
  openAddCategoryModal(): void {
    this.isEditMode = false;
    this.categoryForm.reset();
    this.isModalOpen = true;
  }

  // Open modal for editing a category
  openEditCategoryModal(category: any): void {
    this.isEditMode = true;
    this.selectedCategory = category;
    this.categoryForm.patchValue(category);
    this.isModalOpen = true;
  }

  // Close the modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Handle form submission
  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    const categoryData = this.categoryForm.value;

    if (this.isEditMode) {
      // Update existing category
      this.categoryService.updateCategory(this.selectedCategory.id, categoryData).subscribe(
        (response) => {
          this.showSuccessMessage('Category updated successfully!');
          this.closeModal();
          this.loadCategories(); // Reload categories after update
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    } else {
      // Create new category
      this.categoryService.addCategory(categoryData).subscribe(
        (response) => {
          this.showSuccessMessage('Category created successfully!');
          this.closeModal();
          this.loadCategories(); // Reload categories after creation
        },
        (error) => {
          console.error('Error creating category:', error);
        }
      );
    }
  }

  // Show confirmation dialog before deleting a category
  confirmDeleteCategory(category: any): void {
    this.categoryToDelete = category;
    this.showConfirmation = true;
  }

  // Confirm deletion
  confirmDelete(): void {
    if (this.categoryToDelete) {
      this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe(
        () => {
          this.showSuccessMessage('Category deleted successfully!');
          this.cancelDelete();
          this.loadCategories(); // Reload categories after deletion
        },
        (error) => {
          console.error('Error deleting category:', error);
        }
      );
    }
  }

  // Cancel deletion
  cancelDelete(): void {
    this.categoryToDelete = null;
    this.showConfirmation = false;
  }

  // Show success message
  showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, 3000); // Hide the message after 3 seconds
  }

  // Pagination methods
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
