import { Component } from '@angular/core';
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
export class CarouselComponent {
    @ViewChild('carouselSlide') carouselSlide!: ElementRef;

    slides = [
        {
            id: 1,
            image: 'https://storage.googleapis.com/lnco-artifacts.appspot.com/images/1db5b6db-5b93-40eb-912c-f1c97e0f124f.png',
            caption: 'Slide 1',
            description: 'Description for Slide 1',
        },
        {
            id: 2,
            image: 'https://storage.googleapis.com/lnco-artifacts.appspot.com/images/a3b9c8d7e6f5a4b3c2d1e0f/7021b435-40e1-49d2-bf46-eb78a025117f',
            caption: 'Slide 2',
            description: 'Description for Slide 2',
        },
        {
            id: 3,
            image: 'https://storage.googleapis.com/lnco-artifacts.appspot.com/images/6c043e44-3b5a-4fde-899b-275f821aad83.png',
            caption: 'Slide 3',
            description: 'Description for Slide 3',
        },
    ];

    currentSlideIndex = 0;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    constructor(private renderer: Renderer2) {}

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
            if (event.deltaX > 0) {
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
