import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { timerOutline, chatbubbleEllipsesOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  imports: [IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home">
          <ion-icon name="timer-outline"></ion-icon>
          <ion-label>Timer</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="chat">
          <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
          <ion-label>PomPom AI</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [`
    ion-tab-bar {
      --background: #fffec4;
      border-top: 3px solid rgb(207, 186, 145);
    }
    ion-tab-button {
      --color: rgb(177, 111, 111);
      --color-selected: rgb(123, 15, 15);
      font-family: 'Lilita One', cursive;
    }
    ion-icon { font-size: 24px; }
  `],
})
export class TabsPage {
  constructor() {
    addIcons({ timerOutline, chatbubbleEllipsesOutline });
  }
}