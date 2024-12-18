
import { test, expect } from '@playwright/test';
let baseURL: string = 'http://localhost:3000/users';





test.describe('User management API with loop', () => {

    test.beforeEach(async ({ request }) => {

        const response = await request.get(`${baseURL}`);
        const responseBody = await response.json()
        const numberOfObjects = responseBody.length;

        let userIDs = [];


        for (let i = 0; i < numberOfObjects; i++) {

            let userID = responseBody[i].id;

            userIDs.push(userID);
        }


        for (let i = 0; i < numberOfObjects; i++) {

            let response = await request.delete(`${baseURL}/${userIDs[i]}`);

            expect.soft(response.status()).toBe(200);
        }


        const responseAfterDelete = await request.get(`${baseURL}`);
        expect(responseAfterDelete.status()).toBe(200);
        const responseBodyEmpty = await responseAfterDelete.text()

        expect(responseBodyEmpty).toBe('[]');
    })


    test('GET / - should return empty when no users', async ({ request }) => {
        const response = await request.get(`${baseURL}`);
        expect(response.status()).toBe(200);
        const responseBody = await response.text()
        expect(responseBody).toBe('[]');
    });

    test('Create few users and verify total number', async ({ request }) => {

        const numberOfObjects = 4
        for (let i = 0; i < numberOfObjects; i++) {
            let response = await request.post(`${baseURL}`);

        }
        const response = await request.get(`${baseURL}`);
        const responseBody = await response.json()

        const actualNumObjects = responseBody.length;
        expect.soft(actualNumObjects).toBe(numberOfObjects)
        expect.soft(responseBody).toHaveLength(numberOfObjects)
    });



    test('Create N users, delete all users and verify empty response', async ({ request }) => {
        const numberOfObjects = 4
        const userIds: number[] = []
        for (let i = 0; i < numberOfObjects; i++) {
            let response = await request.post(`${baseURL}`);
            const user = await response.json()
            userIds.push(user.id)
        }

        for (let i = 0; i < numberOfObjects; i++) {

            let response = await request.delete(`${baseURL}/${userIds[i]}`);

            expect.soft(response.status()).toBe(200);
        }
        const responseAfterDelete = await request.get(`${baseURL}`);
        expect(responseAfterDelete.status()).toBe(200);
        const responseBodyEmpty = await responseAfterDelete.text()

        expect(responseBodyEmpty).toBe('[]');
    });



    test('Create N users, delete one user and verify existence of other users', async ({ request }) => {
        const numberOfObjects = 4
        const userIds: number[] = []
        for (let i = 0; i < numberOfObjects; i++) {
            let response = await request.post(`${baseURL}`);
            const user = await response.json()
            userIds.push(user.id)
        }
        await request.delete(`${baseURL}/${userIds[0]}`);
        const response = await request.get(`${baseURL}`);
        const responseBody =  await response.json()
        const actualObjectLength = responseBody.length
        expect.soft(actualObjectLength).toBe(numberOfObjects - 1)

    });

});