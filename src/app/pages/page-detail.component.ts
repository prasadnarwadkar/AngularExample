import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../shared/services';

@Component({
    selector: 'page-detail',
    templateUrl: '././page-detail.component.html',
    styleUrls: ['././page.component.css']
})
export class PageDetailComponent implements OnInit {
    pageDetailForm: FormGroup;

    async createPage() {
        if (this.pageDetailForm.value.page.length < 1) {
            alert("Page name must not be blank")
            return
        }

        if (this.pageDetailForm.value.page.length > 0) {
            try {
                await this.authService.createPage(this.pageDetailForm.value.page!).then((res) => {
                    this.router.navigate(['/pages']);
                });
            }

            catch (error) {
                alert(error)
            }
        }
        else {
            alert('Page can\'t be blank');

        }
    }


    constructor(
        private router: Router,
        private authService: AuthService,
        private fb: FormBuilder
    ) {
        this.pageDetailForm = this.fb.group({
            page: ['']
        });
    }

    async ngOnInit(): Promise<void> {

    }


}
