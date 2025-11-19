import { buildConfig } from 'payload/config';
import path from 'path';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongodbAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';

import Events from './collections/Events';
import Speakers from './collections/Speakers';
import Media from './collections/Media';
import Users from './collections/Users';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  collections: [Events, Speakers, Media, Users],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  db: mongodbAdapter({
    url: process.env.MONGODB_URI,
  }),
});
