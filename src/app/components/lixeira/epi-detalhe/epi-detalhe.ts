import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-epi-detalhe',
  imports: [RouterModule],
  templateUrl: './epi-detalhe.html',
  styleUrl: './epi-detalhe.scss',
})
export class EpiDetalhe implements OnInit {
  id = 0;

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = Number(params['id'] ?? 0);
    });
  }
}
