import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { prismaClient } from '../../../db/prismaClient';

type ShortLink = {
    slug: string;
    url: string;
}

const appRouter = trpc.router().
    query('checkSlug', {
        input: z.object({
            slug: z.string(),
        }),
        async resolve({ input }) {
            console.log(input);
            const count = await prismaClient.shortLink.count({
                where: {
                    slug: input.slug
                }
            });
            console.log('has slug', count);
            return { used: count > 0 };
        }
    })
    .mutation('createSlug', {
        input: z.object({
            slug: z.string(),
            url: z.string()
        }),
        async resolve({ input }) {
            try {
                await prismaClient.shortLink.create({
                    data: {
                        slug: input.slug,
                        url: input.url
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
    });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext: () => null,
});