import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { LoginComponent } from './components/login/login.component';
import { AppMaterialModule } from './modules/app-material/app-material.module';
import { LoginPageComponent } from './pages/login-page/login-page/login-page.component';
import { MainFeedComponent } from './pages/main-feed/main-feed/main-feed.component';

@NgModule({
    declarations: [AppComponent, ChatBoxComponent, LoginComponent, LoginPageComponent, MainFeedComponent],
    imports: [BrowserModule, AppRoutingModule, FormsModule, AppMaterialModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
