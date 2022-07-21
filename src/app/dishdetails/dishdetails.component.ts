import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetails',
  templateUrl: './dishdetails.component.html',
  styleUrls: ['./dishdetails.component.scss']
})

export class DishdetailsComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  errMess: string;

  noteForm: FormGroup;
  note: Comment;
  rating: number;
  comment: string;
  @ViewChild('fform') noteFormDirective: NgForm;

  formErrors: {[index: string]:any} = {//: {[index: string]:any} because need to specify index type
    'comment': '',
    'author': ''
  };

  validationMessages: {[index: string]:any} = {
    'comment': {
      'required': 'Comment is required.',
      'minLength': 'Comment must be at least 3 characters long.',
      'maxLength': 'Comment cannot be more than 256 characters.'
    },
    'author': {
      'required': 'Name is required.',
      'minLength': 'Name must be at least 2 characters long.',
      'maxLength': 'Name cannot be more than 25 characters.'
    }
  }

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL: string) {
      this.createForm();
    }

  ngOnInit() {
    this.dishservice.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
        errmess => this.errMess = <any>errmess );
  }

  goBack(): void {
    this.location.back();
  }

  //Trouver le plat précédent/suivant (pour les bouttons de navigation entre plats)
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    //calculs avec % pour les cas aux extrémités (premier et dernier plat)
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  createForm(): void {
    this.noteForm = this.fb.group({
      rating: 5,
      comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(256)] ],
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      date : ''
    });

    this.noteForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  //when values changes
  onValueChanged(data?: any) {//"?" = optionnal param
    if (!this.noteForm) { return; }
    const form = this.noteForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clean prev error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  
  onSubmit() {
    this.note = this.noteForm.value;
    this.note.date = Date();
    console.log(this.note);
    this.dish.comments.push(this.note);//add note in the comment list
    this.noteFormDirective.resetForm(this.rating);
    this.noteForm.reset({
      rating: 5,
      comment: '',
      author: '',
      date: ''
    });
  }
}
