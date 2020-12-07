import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoryModel } from '../../model/category.model';
import { CategoryListServiceService } from '../../services/category-list-service.service'

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: CategoryModel[] = [];
  isClassActive: boolean = false;
  @Output() categoryEvent = new EventEmitter<any>();
  @Input() selectedCategory: number;

  constructor(private categoryListServiceService: CategoryListServiceService) { }

  ngOnInit(): void {
    this.categoryListServiceService.getCategories().subscribe((data: CategoryModel[]) => {
      if (data)
        this.categories = data;
    });
  }

  sendCategoryChange($event, index: number): void {
    this.categoryEvent.emit({ value: $event.target.innerText, index: index });
    this.isClassActive = !this.isClassActive;
  }

}
