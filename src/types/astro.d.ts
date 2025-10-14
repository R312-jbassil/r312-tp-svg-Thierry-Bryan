declare namespace App {
  interface Locals {
    lang?: string;
    user?: {
      id: string;
      email: string;
      name?: string;
      created?: string;
      updated?: string;
    };
  }
}