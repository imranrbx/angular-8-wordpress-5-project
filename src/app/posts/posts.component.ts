import { ActivatedRoute } from '@angular/router';
import { WPAPIService } from './../services/wpapi.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  posts = null;
  page = null;
  pages = null;
  constructor(private wpapi: WPAPIService, private route: ActivatedRoute) {
    this.page = this.route.snapshot.queryParamMap.get('page')
      ? this.route.snapshot.queryParamMap.get('page')
      : 1;
  }
  ngOnInit() {
    if (this.route.snapshot.paramMap.get('slug')) {
      this.getPost(this.route.snapshot.paramMap.get('slug'));
    } else {
      this.wpapi.posts(`per_page=10&page=${this.page}`).subscribe(posts => {
        this.posts = posts.body;
        this.pages = new Array(
          parseInt(posts.headers.get('x-wp-totalpages'), 10),
        );
      });
    }
  }
  updatePage() {
    this.page = this.route.queryParams.subscribe(q => {
      this.page = q.page ? q.page : this.page;
      this.wpapi.posts(`per_page=10&page=${this.page}`).subscribe(posts => {
        this.posts = posts.body;
      });
    });
  }
  getPost(slug) {
    this.wpapi
      .posts(`slug=${slug}`)
      .subscribe(posts => (this.posts = posts.body));
  }
}
