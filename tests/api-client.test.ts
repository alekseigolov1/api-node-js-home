import { test, expect } from '@playwright/test';
import {ApiClient} from "../src/api-client";



const baseURL = 'http://localhost:3000/users';

test.describe('User management API with loop', () => {

    test.beforeEach(async ({ request }) => {

        const apiClient = new ApiClient(request);
        const users = await apiClient.getUsers();
        const userIds = users.map(user => user.id);

        for (const userId of userIds) {
            await apiClient.deleteUser(userId);
        }

        const remainingUsers = await apiClient.getUsers();
        expect(remainingUsers).toEqual([]);
    });

    test('GET / - should return 200 OK with empty array when no users', async ({ request }) => {
        const apiClient = new ApiClient(request);
        const users = await apiClient.getUsers();
        expect(users).toEqual([]);
    });

    test('POST / - should add a user', async ({ request }) => {
        const apiClient = new ApiClient(request);
        const user = await apiClient.createUser();
        expect(user).toHaveProperty('id');
    });

    test('GET /:id - should get user by ID', async ({ request }) => {
        const apiClient = new ApiClient(request);
        const newUser = await apiClient.createUser();
        const user = await apiClient.getUserById(newUser.id);
        expect(user).toHaveProperty('id', newUser.id);
    });

    test('DELETE /:id - should delete a user by ID', async ({ request }) => {
        const apiClient = new ApiClient(request);
        const newUser = await apiClient.createUser();
        await apiClient.deleteUser(newUser.id);
        const user = await apiClient.getUserById(newUser.id);
        expect(user).toBeNull();
    });

    test('GET /:id - should return 404 if user not found', async ({ request }) => {
        const apiClient = new ApiClient(request);
        const response = await apiClient.getUserById(1000);
        expect(response).toBeNull();
    });


});