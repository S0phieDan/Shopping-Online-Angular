import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FileTransferServiceService } from '../../services/file-transfer-service.service';
import *  as fileSaver from 'file-saver';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.css']
})
export class OrderCompleteComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  @Input() order_id: String;
  @Input() orderCreationDate: String;
  @Input() totalPrice: number;
  @Input() shippingDate: String;

  constructor(private router: Router, private fileTransferService: FileTransferServiceService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  download(): void {
    this.subscription.add(
      this.fileTransferService.downloadFile().subscribe(response => {
        const blob = new Blob([response], { type: 'text/plain' });
        fileSaver.saveAs(blob, 'receipt.txt');
      })
    )
  }

  finishOrder(): void {
    this.router.navigate(['/']);
  }

}
