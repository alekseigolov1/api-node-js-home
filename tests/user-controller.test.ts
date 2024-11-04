// tests/api.spec.ts
import { test, expect } from '@playwright/test';
let baseURL: string = 'http://localhost:3000/users';

test.describe('User management API', () => {

    test('GET / - should return empty when no users', async ({ request }) => {
        const response = await request.get(`${baseURL}`);
        expect(response.status()).toBe(200);
        const responseBody = await response.text()
        expect(responseBody).toBe('[]');
    });

    test('GET /:id - should return a user by ID', async ({ request }) => {
        const response = await request.post(`${baseURL}`);
        expect(response.status()).toBe(201);
        const responseBody = await response.json()
        expect.soft(responseBody.id).toBeDefined()
        expect.soft(responseBody.email).toBeDefined()
        expect.soft(responseBody.name).toBeDefined()


        const id = responseBody.id
        const response1 = await request.get(`${baseURL}/${id}`);
        expect(response1.status()).toBe(200);
        const responseBody1 = await response.json()
        expect.soft(responseBody1.id).toBeDefined()
        expect.soft(responseBody1.email).toBeDefined()
        expect.soft(responseBody1.name).toBeDefined()
    });

    test('GET /:id - should return 404 if user not found', async ({ request }) => {
        const userId = 1000
        const response = await request.get(`${baseURL}/${userId}`);

        expect.soft(response.status()).toBe(404);
        const responseBody = await response.json()
        expect.soft(responseBody.message).toBe("User not found")

    });

    test('POST / - should add a new user', async ({ request }) => {
        const response = await request.post(`${baseURL}`);
        expect.soft(response.status()).toBe(201);
        const returnedUser = await response.json()
        const id = returnedUser.id
        const usersResponse = await request.get(`${baseURL}/${id}`)
        const users = await usersResponse.json()
        expect.soft(users.id).toEqual(id)

    });

    test('DELETE /:id - should delete a user by ID', async({ request }) => {
        const response = await request.post(`${baseURL}`);
        expect(response.status()).toBe(201);
        const responseBody = await response.json()
        console.log(responseBody)
        const id= responseBody.id;
        const deleteResponse = await request.delete(`${baseURL}/${id}`);
        expect(deleteResponse.status()).toBe(200);
        const deleteResponseBody = await deleteResponse.json()
        console.log(deleteResponseBody)
        const getResponse = await request.get(`${baseURL}/${id}`);
        expect(getResponse.status()).toBe(404);

    });

    test('DELETE /:id - should return 404 if user not found', async ({ request }) => {
        const response = await request.delete(`${baseURL}/1000`);
        expect(response.status()).toBe(404);
        const responseBody = await response.json()
        expect.soft(responseBody.message).toMatch('User not found')
        console.log(responseBody)


    });


});
