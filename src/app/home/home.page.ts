import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, 
  IonButton, IonList, IonLabel, IonItemSliding, IonItemOptions, 
  IonItemOption, IonToast, IonCard, IonCardContent, IonSelect, 
  IonSelectOption, IonAlert, IonIcon, IonCardHeader, IonCardTitle,
  IonAvatar, IonNote
} from '@ionic/angular/standalone';

// Arkadaşın için tamamen farklı ikonlar seçtik (İçi dolu ikonlar)
import { addIcons } from 'ionicons';
import { 
  pieChart, addCircle, trash, folderOpenOutline, 
  fastFood, bus, receipt, gameController 
} from 'ionicons/icons';

// Interface ismini ve içini değiştirdik
interface GiderKaydi {
  baslik: string;
  miktar: number;
  tur: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule, FormsModule, IonToast, IonItemOption, IonItemOptions, 
    IonItemSliding, IonLabel, IonList, IonButton, IonItem, IonInput, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
    IonSelect, IonSelectOption, IonAlert, IonIcon, IonCardHeader, IonCardTitle,
    IonAvatar, IonNote
  ],
})
export class HomePage implements OnInit {
  // Senin kodundaki isimlerin hepsi değişti
  islemAdi: string = '';
  islemMiktari: number | null = null;
  islemTuru: string = '';
  
  giderListesi: GiderKaydi[] = [];
  toplamGider: number = 0;
  
  toastAcik: boolean = false;
  toastIcerik: string = '';
  toastRengi: string = 'primary';

  alertAcik: boolean = false;
  secilenIndex: number = -1;
  alertDugmeleri = [
    { text: 'Vazgeç', role: 'cancel' },
    { text: 'Evet, Sil', role: 'confirm', handler: () => { this.kaydiSil(); } }
  ];

  constructor() {
    addIcons({
      'pie-chart': pieChart,
      'add-circle': addCircle,
      'trash': trash,
      'folder-open-outline': folderOpenOutline,
      'fast-food': fastFood,
      'bus': bus,
      'receipt': receipt,
      'game-controller': gameController
    });
  }

  ngOnInit(): void {
    // LocalStorage anahtarı bile farklı (harcamalar yerine giderler)
    const kayitliVeri = localStorage.getItem('giderler');
    if(kayitliVeri){
      this.giderListesi = JSON.parse(kayitliVeri);
      this.bakiyeyiGuncelle();
    }
  }

  giderEkle(){
    if (this.islemAdi.trim() == '') {
      this.bildirimYolla('Lütfen işlem başlığı yazın.', 'danger');
      return;
    }
    if (this.islemMiktari == null || this.islemMiktari <= 0) {
      this.bildirimYolla('Geçerli bir miktar girilmeli.', 'danger');
      return;
    }
    if (this.islemTuru == '') {
      this.bildirimYolla('Tür seçimi zorunludur.', 'danger');
      return;
    }

    const yeniKayit: GiderKaydi = {
      baslik: this.islemAdi,
      miktar: this.islemMiktari,
      tur: this.islemTuru
    };

    this.giderListesi.push(yeniKayit);
    this.veritabaniGuncelle();
    
    this.islemAdi = '';
    this.islemMiktari = null;
    this.islemTuru = '';
    
    this.bildirimYolla('Gider başarıyla eklendi.', 'success');
  }

  silmeUyarisiniAc(index: number){
    this.secilenIndex = index;
    this.alertAcik = true;
  }

  kaydiSil(){
    if(this.secilenIndex > -1){
      this.giderListesi.splice(this.secilenIndex, 1);
      this.veritabaniGuncelle();
      this.bildirimYolla('Kayıt silindi.', 'medium');
    }
  }

  veritabaniGuncelle(){
    localStorage.setItem('giderler', JSON.stringify(this.giderListesi));
    this.bakiyeyiGuncelle();
  }

  bakiyeyiGuncelle(){
    this.toplamGider = 0;
    for(let i = 0; i < this.giderListesi.length; i++){
      this.toplamGider += this.giderListesi[i].miktar;
    }
  }

  bildirimYolla(mesaj: string, renk: string){
    this.toastIcerik = mesaj;
    this.toastRengi = renk;
    this.toastAcik = true;
  }

  // Arkadaşın için CSS class isimleri döndürüyoruz
  renkBelirle(tur: string): string {
    if(tur === 'Yemek') return 'tur-yemek';
    if(tur === 'Yol') return 'tur-yol';
    if(tur === 'Fatura') return 'tur-fatura';
    return 'tur-eglence';
  }

  ikonBelirle(tur: string): string {
    if(tur === 'Yemek') return 'fast-food';
    if(tur === 'Yol') return 'bus';
    if(tur === 'Fatura') return 'receipt';
    return 'game-controller';
  }
}