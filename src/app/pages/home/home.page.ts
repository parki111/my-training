import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  protected readonly links = [
    {
      title: 'Explore the Docs',
      link: 'https://github.com/FHSS-Web-Team/Documentation',
    },
    {
      title: 'Learn with Tutorials',
      link: 'https://github.com/FHSS-Web-Team/Documentation/blob/main/training/README.md',
    },
    {
      title: 'Get a CES ChatGPT License',
      link: 'https://genai.byu.edu/obtaining-a-chatgpt-edu-license',
    },
    {
      title: 'CLI Docs',
      link: 'https://github.com/FHSS-Web-Team/fhss-cli',
    },
    {
      title: 'Backend Utils Docs',
      link: 'https://github.com/FHSS-Web-Team/backend-utils',
    },
    {
      title: 'Frontend Utils',
      link: 'hhttps://github.com/FHSS-Web-Team/frontend-utils',
    },
  ];
}
