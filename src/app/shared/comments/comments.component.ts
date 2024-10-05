
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Comment, PostComment, User, UserComment } from '../../../types';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../services/comment.service';
import { Subscription } from 'rxjs';
import { EditorModule } from 'primeng/editor';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EditorModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent {
  private baseUrl = environment.apiUrl;
  @Input() postId!: number;
  comments: Comment[] = [];
  @Input() user!: User;

  selectedReplyTo: User | null = null; 
  selectedCommentId: number | null = null;
  
  private intervalId: any;
  private commentSubscription: Subscription = new Subscription();

  @ViewChild('commentForm') commentForm!: ElementRef;

  form = new FormGroup({
    commentText: new FormControl(null,[Validators.required, Validators.maxLength(1500)])
  })

  constructor(private commentService: CommentService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.fetchComments(); 


    this.intervalId = setInterval(() => {
        this.fetchComments();
    }, 600000); //10 minutes
  }
  fetchComments(): void {
    this.commentSubscription = this.commentService.getComments(this.postId).subscribe(
        (comments : UserComment[]) => {
            this.comments = comments;
        },
        (error) => {
            console.error('Error fetching comments:', error);
        }
    );
  }

  selectCommentForReply(comment: Comment): void {
    this.selectedReplyTo = comment.user; 
    this.commentForm.nativeElement.scrollIntoView({ behavior: 'smooth' });
    this.selectedCommentId = comment.id;
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const newComment: PostComment = {
        id: 0,
        content: this.form.value.commentText!,
        postId: this.postId,
        parentCommentId: this.selectedCommentId ?? null,
      };
      
      this.commentService.addComment(`${this.baseUrl}/Comments`,newComment).subscribe(
        (response: UserComment) => {
          if (this.selectedCommentId) {
            const parentComment = this.comments.find(c => c.id === this.selectedCommentId);
            if (parentComment) {
              parentComment.replies.push(response);
            }
          } else {
            this.comments.unshift(response);
          }
          this.form.reset();
          this.selectedCommentId = null;
        },
        (error) => {
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          console.error('Error submitting comment:', error);
        }
      );
    }
  }

  toggleLike(comment: UserComment): void {
    const url = `${this.baseUrl}/CommentLikes/`;
    if (comment.likedByUser) {
        this.commentService.removeCommentLike(url + comment.id).subscribe(
            () => {
                comment.countLikes--;
                comment.likedByUser = false;
            },
            (error) => {
              console.log("error", error.status)
            }
        );
    } else {
        this.commentService.addCommentLike(url, comment.id).subscribe(
            (response: UserComment) => {
                comment.countLikes++;
                comment.likedByUser = true;
            },
            (error) => {
                console.error('Error adding like:', error);
            }
        );
    }
  }
}
