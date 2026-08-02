import { Agent, CredentialSession } from '@atproto/api';

const session = new CredentialSession(new URL('https://public.api.bsky.app'));

export const atpAgent = new Agent(session);
