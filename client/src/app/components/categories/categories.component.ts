import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoryModel } from '../../model/category.model';
import { CategoryListServiceService } from '../../services/category-list-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  categories: CategoryModel[] = [];
  isClassActive: boolean = false;
  @Output() categoryEvent = new EventEmitter<any>();
  @Input() selectedCategory: number;

  constructor(private categoryListServiceService: CategoryListServiceService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.categoryListServiceService.getCategories().subscribe((data: CategoryModel[]) => {
        if (data.length)
          this.categories = data;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  sendCategoryChange($event, index: number): void {
    this.categoryEvent.emit({ value: $event.target.innerText, index: index });
    this.isClassActive = !this.isClassActive;
  }

}
