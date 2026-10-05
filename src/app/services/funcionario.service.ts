import { inject, Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EpiService {
	private readonly http = inject(HttpClient);
}