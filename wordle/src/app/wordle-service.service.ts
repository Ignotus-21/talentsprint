import { Injectable } from '@angular/core';
import * as mockGuessResponsesSuccess from './mockGuessResponsesSuccess.json';
import * as mockGuessResponsesFailure from './mockGuessResponsesFailure.json';
import * as mockRegisterResponse from './mockRegisterResponse.json';
import * as mockCreateResponse from './mockCreateResponse.json';
import { CreateRequest, CreateResponse, GuessRequest, GuessResponse, RegisterRequest, RegisterResponse } from './types';

@Injectable({
  providedIn: 'root'
})
export class WordleServiceService {

  mockGuessIdx = 0;
  baseUrl = "https://we6.talentsprint.com/wordle/game";
  registerUrl = "/register";
  createUrl = "/create";
  guessUrl = "/guess";
  headers = {
    "Content-Type": "application/json"
  }

  constructor() { }

  async submitGuess(id: string, guess: string) : Promise<GuessResponse> {
    console.log(`One day I will connect to the backend and an actual request will be made. For now pretend that I did submit ${guess}`);
    console.log(mockGuessResponsesSuccess.responses);
    var guessRequest: GuessRequest = { id, guess };
    var response = await fetch(this.baseUrl + this.guessUrl, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(guessRequest),
      credentials: 'include'
    });
    if (response.status === 200) {
      var body = await response.json();
      return body as GuessResponse;
    } else {
      var body = await response.json();
      if (body.answer) {
        return body as GuessResponse; //The server is strange, it gives the last piece of feedback as a 422
      } else {
        return new Promise((resolve, reject) => reject(`Something is weird. Check your network tab`));
      }
    }
  }

  async register(username: string): Promise<RegisterResponse> {
    var registerRequest: RegisterRequest = {
      mode: "wordle",
      name: username
    };
    // var actualResponse: Response;
    // var promiseOfAResponse = fetch(this.baseUrl + this.registerUrl, {
    //   method: "POST",
    //   body: JSON.stringify(registerRequest),
    // });
    // promiseOfAResponse.then((response) => {
    //   actualResponse = response;
    // });
    var response = await fetch(this.baseUrl + this.registerUrl, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(registerRequest),
      credentials: "include"
    });
    if (response.status === 201) {
      var body = await response.json();
      return body as RegisterResponse;
    } else {
      return new Promise((resolve, reject) => reject("Couldn't create user. Check the network tab?"));
    }
  }

  async create(id: string): Promise<CreateResponse> {
    var createRequest: CreateRequest = {
      id: id,
      overwrite: true
    };
    var response = await fetch(this.baseUrl + this.createUrl, {
      headers: this.headers,
      method: "POST",
      body:JSON.stringify(createRequest),
      credentials: "include"
    });
    if (response.status === 201) {
      var body = await response.json();
      return body as CreateResponse;
    } else {
      var body = await response.json();
      return new Promise((resolve, reject) => reject(`Couldn't create game. Check the network tab? The server said: ${body.message} and the response code was ${response.status}`))
    }
  }
}
