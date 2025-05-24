import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { AuthService } from '../../app/shared/services/auth/auth.service';
import { PermissionRequest } from '../models/models';


@Directive({
    selector: '[myDisableIfUnauthorized]'
})
export class MyDisableIfUnauthorizedDirective implements OnInit {
    @Input('myDisableIfUnauthorized')
    permission!: PermissionRequest; // Required permission passed in

    constructor(private el: ElementRef, private authorizationService: AuthService) { }

    async ngOnInit() {
        if (!await this.authorizationService.hasPermission(this.permission.action, this.permission.pageName)) {
            this.el.nativeElement.setAttribute("disabled", "disabled")
        }
        else{
            this.el.nativeElement.removeAttribute("disabled")
        }
    }
}