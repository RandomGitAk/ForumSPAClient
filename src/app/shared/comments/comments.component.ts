
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Comment, PostComment, User, UserComment } from '../../../types';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../services/comment.service';
import { Subscription } from 'rxjs';
import { EditorModule } from 'primeng/editor';
import { environment } from '../../../environments/environment';

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

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.fetchComments(); 


    this.intervalId = setInterval(() => {
        this.fetchComments();
    }, 600000); //10 minutes
  }
  fetchComments(): void {
    this.commentSubscription = this.commentService.getComments(this.postId).subscribe(
        (comments : UserComment[]) => {
          console.log("comments", comments)
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
    console.log('Form valid:', this.form.valid);
    console.log('Form value:', this.form.value);
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
          console.error('Error submitting comment:', error);
        }
      );
    }
  }

  toggleLike(comment: UserComment): void {
    const url = `${this.baseUrl}/CommentLikes/`;
    console.log(comment.id)
    if (comment.likedByUser) {
        this.commentService.removeCommentLike(url + comment.id).subscribe(
            () => {
                comment.countLikes--;
                comment.likedByUser = false;
            },
            (error) => {
                console.error('Error removing like:', error);
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
