import { Component, OnInit } from '@angular/core';
import { Renderer2, ViewChild, ElementRef } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-carousel',
    imports: [CommonModule],
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.css'],
    animations: [
        trigger('slideAnimation', [
            transition('void => *', [style({ transform: 'translateX(-100%)' }), animate('500ms ease-in-out')]),
            transition('* => void', [animate('500ms ease-in-out', style({ transform: 'translateX(100%)' }))]),
        ]),
    ],
})
export class CarouselComponent implements OnInit {
    @ViewChild('carouselSlide') carouselSlide!: ElementRef;

    slides = [
        { id: 1, image: 'path/to/image1.jpg', caption: 'Slide 1', description: 'Description for Slide 1' },
        { id: 2, image: 'path/to/image2.jpg', caption: 'Slide 2', description: 'Description for Slide 2' },
        { id: 3, image: 'path/to/image3.jpg', caption: 'Slide 3', description: 'Description for Slide 3' },
    ];

    currentSlideIndex = 0;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    constructor(private renderer: Renderer2) {}
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
    isScrolling = false;

    nextSlide(): void {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
    }

    prevSlide(): void {
        this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
    }

    onScroll(event: WheelEvent): void {
        if (!this.isScrolling) {
            this.isScrolling = true;
            if (event.deltaY > 0) {
                this.nextSlide(); // Scroll down, move to the next slide
            } else {
                this.prevSlide(); // Scroll up, move to the previous slide
            }
            event.preventDefault(); // Prevent default scrolling behavior
            setTimeout(() => {
                this.isScrolling = false;
            }, 500); // Debounce time (adjust as needed)
        }
    }

    updateSlidePosition(): void {
        const slideContainer = this.carouselSlide.nativeElement as unknown;
        const transformValue = `translateX(-${this.currentSlideIndex * 100}%)`;
        this.renderer.setStyle(slideContainer, 'transform', transformValue);
    }

    touchStartX!: number;
    touchMoveX!: number;

    onTouchStart(event: TouchEvent): void {
        this.touchStartX = event.touches[0].clientX;
    }

    onTouchMove(event: TouchEvent): void {
        this.touchMoveX = event.touches[0].clientX;
    }

    onTouchEnd(event: TouchEvent): void {
        event;
        const diffX = this.touchMoveX - this.touchStartX;
        if (Math.abs(diffX) > 50) {
            // Adjust the threshold as needed
            if (diffX > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        }
    }
}
