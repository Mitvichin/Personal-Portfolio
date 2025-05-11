import { http, HttpResponse, JsonBodyType, PathParams } from 'msw';
import { BASE_API_ULR } from '../../utils/constants';
import { User } from '../../types/User';
import { Role } from '../../types/Roles';
import { LoginForm } from '../../types/LoginForm';
import { ContactMeForm } from '../../types/Message';

const admin: User = {
  id: '1',
  firstName: 'Admin',
  lastName: 'Adminov',
  email: 'admin@example.com',
  role: Role.ADMIN,
};

const user: User = {
  id: '2',
  firstName: 'Test',
  lastName: 'Testov',
  email: 'test@example.com',
  role: Role.USER,
};

const getUser = (id: string) => ({
  id,
  firstName: 'Test',
  lastName: 'Testov',
  email: 'test@gmail.com',
  role: +id % 2 === 0 ? Role.ADMIN : Role.USER,
});

const getMessage = (id: string) => ({
  id: id,
  firstName: 'Test',
  lastName: 'Testov',
  email: 'test@gmail.com',
  message: `Test msg ${id}`,
  created_at: '2025-05-01T19:58:23.690Z',
});

const getPaginatedData = <P>(
  page: number,
  limit: number,
  factory: (id: string) => P,
  totalPages: number = 2,
) => {
  const offset = (page - 1) * limit;
  const messages = [];

  for (let i = offset; i < +limit + offset; i++) {
    messages.push(factory(`${i}`));
  }

  const total = +limit + offset;

  return {
    data: messages,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

const authHandlers = [
  http.post<PathParams, LoginForm, JsonBodyType>(
    `${BASE_API_ULR}/auth/login`,
    async ({ request }) => {
      const { email } = await request.json();

      if (email !== admin.email) {
        return HttpResponse.json(
          { message: 'INVALID_CREDENTIALS' },
          { status: 400 },
        );
      }

      return HttpResponse.json(admin, {
        status: 200,
        headers: { 'Set-cookie': `auth=valid` },
      });
    },
  ),
  http.post(`${BASE_API_ULR}/auth/register`, () => {
    return HttpResponse.json({}, { status: 201 });
  }),
  http.get(`${BASE_API_ULR}/auth/verify-authentication`, () => {
    return HttpResponse.json(admin, { status: 200 });
  }),
  http.get(`${BASE_API_ULR}/auth/csrf-token`, () => {
    return HttpResponse.json({ csrfToken: 'valid-token' }, { status: 200 });
  }),
];

const messageHandlers = [
  http.post<PathParams, ContactMeForm, JsonBodyType>(
    `${BASE_API_ULR}/message`,
    async ({ request }) => {
      const msg = await request.json();

      return HttpResponse.json(msg, { status: 201 });
    },
  ),
  http.get(`${BASE_API_ULR}/message`, async ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || 1;
    const limit = url.searchParams.get('limit') || 5;

    const res = getPaginatedData(+page, +limit, getMessage);

    return HttpResponse.json(res, { status: 200 });
  }),
  http.delete<PathParams, { id: string }, JsonBodyType>(
    `${BASE_API_ULR}/message`,
    async ({ request }) => {
      const { id } = await request.json();

      const res = getUser(id);
      return HttpResponse.json(res, { status: 200 });
    },
  ),
];

const userHandlers = [
  http.get(`${BASE_API_ULR}/user`, async ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || 1;
    const limit = url.searchParams.get('limit') || 5;

    const res = getPaginatedData(+page, +limit, getUser);

    return HttpResponse.json(res, { status: 200 });
  }),
  http.delete<PathParams, { id: string }, JsonBodyType>(
    `${BASE_API_ULR}/user`,
    async ({ request }) => {
      const { id } = await request.json();

      const res = getUser(id);
      return HttpResponse.json(res, { status: 200 });
    },
  ),
];

export const handlers = [...authHandlers, ...messageHandlers, ...userHandlers];

export const failVerifyAuthHandler = http.get(
  `${BASE_API_ULR}/auth/verify-authentication`,
  () => {
    return HttpResponse.json(
      { message: 'INVALID_CREDENTIALS' },
      { status: 401 },
    );
  },
);

export const verifyAuthHandlerWithUser = http.get(
  `${BASE_API_ULR}/auth/verify-authentication`,
  () => HttpResponse.json(user, { status: 200 }),
);

export const deleteNotFound = (path: string) =>
  http.delete(`${BASE_API_ULR}/${path}`, async () => {
    const res = { message: 'NOT_FOUND' };
    return HttpResponse.json(res, { status: 404 });
  });

export const deleteServerError = (path: string) =>
  http.delete(`${BASE_API_ULR}/${path}`, async () => {
    const res = { message: 'INTERNAL_SERVER_ERROR' };
    return HttpResponse.json(res, { status: 500 });
  });

export const postServerError = (path: string) =>
  http.post(`${BASE_API_ULR}/${path}`, async () => {
    const res = { message: 'INTERNAL_SERVER_ERROR' };
    return HttpResponse.json(res, { status: 500 });
  });
