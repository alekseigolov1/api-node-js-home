import { StatusCodes } from 'http-status-codes';
import { expect } from '@playwright/test';

const baseURL = 'http://localhost:3000/users';

export class ApiClient {
    constructor(request) {
        this.request = request;
    }

    async getUsers() {
        const response = await this.request.get(baseURL);
        expect(response.status()).toBe(StatusCodes.OK);

        return response.json();
    }

    async createUser() {
        const response = await this.request.post(baseURL, {});
        expect(response.status()).toBe(StatusCodes.CREATED);


        return response.json();
    }

    async getUserById(userId) {
        const response = await this.request.get(`${baseURL}/${userId}`);
        if (response.status() === StatusCodes.NOT_FOUND) {
            return null;
        }
        expect(response.status()).toBe(StatusCodes.OK);


        return response.json();
    }

    async deleteUser(userId) {
        const response = await this.request.delete(`${baseURL}/${userId}`);
        if (response.status() === StatusCodes.NOT_FOUND) {
            return response;
        }
        expect(response.status()).toBe(StatusCodes.OK)

        return response;
    }
}