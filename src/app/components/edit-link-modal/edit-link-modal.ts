import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import Modal from 'bootstrap/js/dist/modal';
import {Link} from '@app/models/link';

@Component({
  selector: 'app-edit-link-modal',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-link-modal.html',
  styleUrl: './edit-link-modal.css'
})
export class EditLinkModal implements AfterViewInit{

  @Input() link: Link | null = null;
  @Output() updated = new EventEmitter<any>();

  @ViewChild('modalElement') modalElementRef!: ElementRef;

  modal!: Modal;

  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      original_url: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]]
    });
  }

  ngAfterViewInit(): void {
    this.modal = new Modal(this.modalElementRef.nativeElement);
  }

  open(link: Link) {
    this.link = link;
    this.editForm.patchValue({ original_url: link.original_url });
    this.modal.show();
  }

  close() {
    this.modal.hide();
  }

  submit() {
    if (this.editForm.valid) {
      const updated = {
        ...this.link,
        original_url: this.editForm.value.original_url
      };
      this.updated.emit(updated);
      this.close();
    }
  }

}
