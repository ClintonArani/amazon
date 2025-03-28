// filter.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  private categoryFilterSubject = new BehaviorSubject<string>('');

  searchQuery$ = this.searchQuerySubject.asObservable();
  categoryFilter$ = this.categoryFilterSubject.asObservable();

  setSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }

  setCategoryFilter(categoryId: string) {
    this.categoryFilterSubject.next(categoryId);
  }
}