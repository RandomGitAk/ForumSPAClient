import { Component, Input } from '@angular/core';
import { Post } from '../../../../types';

import { CardModule } from 'primeng/card';
import { PostDatePipe } from '../../../pipes/post-date.pipe';
import { ContentPipe } from '../../../pipes/content.pipe';
import { RouterModule } from '@angular/router';
import { FroalaViewModule } from 'angular-froala-wysiwyg';


@Component({
  selector: 'app-article-main',
  standalone: true,
  imports: [CardModule,
    PostDatePipe,
    ContentPipe,
    RouterModule,
    FroalaViewModule
  ],
  templateUrl: './article-main.component.html',
  styleUrl: './article-main.component.scss'
})
export class ArticleMainComponent {
  @Input() post!: Post;

  get truncatedContent() {
    return this.truncateContent(this.post.content, 100); 
  }

  private truncateContent(content: string, length: number): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const text = doc.body.textContent ?? '';
    return text.length > length ? text.slice(0, length) + '...' : text;
  }
}
