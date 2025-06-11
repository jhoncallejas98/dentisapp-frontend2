import { Component} from '@angular/core'

@Component ({
    selector: "counter",
    templateUrl: "./counter.html",
    styleUrl: "./counter.css" 
})

export class Counter{
    title: string = " HOLAAA ♥ Bienvenido";
    counter: number = 0;

    add() {
        this.counter++;
    }
    substract() {
        if(this.counter > 0){
        this.counter--;
        }
    }
}