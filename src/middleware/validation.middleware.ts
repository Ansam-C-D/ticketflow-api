import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { ZodError } from 'zod';

type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

function assignRequestProperty<T>(
  request: Request,
  property: 'body' | 'params' | 'query',
  value: T
) {
  Object.defineProperty(request, property, {
    value,
    writable: true,
    configurable: true,
    enumerable: true
  });
}

export function validate(schemas: RequestSchemas) {
  return (request: Request, _response: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        assignRequestProperty(
          request,
          'body',
          schemas.body.parse(request.body)
        );
      }

      if (schemas.params) {
        assignRequestProperty(
          request,
          'params',
          schemas.params.parse(request.params)
        );
      }

      if (schemas.query) {
        assignRequestProperty(
          request,
          'query',
          schemas.query.parse(request.query)
        );
      }

      next();
    } catch (error) {
      console.log('catch');
      if (error instanceof ZodError) {
        next(error);
        return;
      }

      next(error);
    }
  };
}
