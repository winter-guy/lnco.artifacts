/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Renderer2, ViewChild, ElementRef } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'carousel',
    imports: [CommonModule, RouterModule],
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.css'],
    animations: [
        trigger('slideAnimation', [
            transition('void => *', [style({ transform: 'translateX(-100%)' }), animate('500ms ease-in-out')]),
            transition('* => void', [animate('500ms ease-in-out', style({ transform: 'translateX(100%)' }))]),
        ]),
    ],
})
export class CarouselComponent implements OnInit, OnDestroy {
    @ViewChild('carouselSlide') carouselSlide!: ElementRef;
    @Input() imgs!: string[];
    @Input() urlId!: string;

    currentSlideIndex = 0;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

    ngOnInit(): void {
        const carouselContainer = this.elementRef.nativeElement.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('touchstart', this.onTouchStart.bind(this));
            carouselContainer.addEventListener('touchmove', this.onTouchMove.bind(this));
            carouselContainer.addEventListener('touchend', this.onTouchEnd.bind(this));
        }
    }

    isScrolling = false;

    nextSlide(): void {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.imgs.length;
    }

    prevSlide(): void {
        this.currentSlideIndex = (this.currentSlideIndex - 1 + this.imgs.length) % this.imgs.length;
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

    ngOnDestroy(): void {
        const carouselContainer = this.elementRef.nativeElement.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('touchstart', this.onTouchStart.bind(this));
            carouselContainer.addEventListener('touchmove', this.onTouchMove.bind(this));
            carouselContainer.removeEventListener('touchend', this.onTouchEnd.bind(this));
        }
    }
}
