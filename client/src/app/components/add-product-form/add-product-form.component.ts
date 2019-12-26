import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Category } from 'src/models/category';

@Component({
  selector: 'app-add-product-form',
  templateUrl: './add-product-form.component.html',
  styleUrls: ['./add-product-form.component.css']
})
export class AddProductFormComponent implements OnInit {
  /**
   * Icono de Agregar producto
   */
  private faPlus = faPlus;

  /**
   * Categorías registradas
   */
  private categories: Array<Category>;


  private comesInBoxes: boolean;

  private comesInUnits: boolean;

  private comesInOthers: boolean;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  /**
   * Abre el formulario
   * @param content Contenido del formulario
   */
  private open(content: any) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * 
   */
  private boxesOnClick() {
    this.comesInBoxes = !this.comesInBoxes;
  }

  /**
   * 
   */
  private unitsOnClick() {
    this.comesInUnits = !this.comesInUnits;
  }
  /**
   * 
   */
  private othersOnClick() {
    this.comesInOthers = !this.comesInOthers;
  }
}
