import { CollectionConfig } from 'payload/types';

const Speakers: CollectionConfig = {
    slug: 'speakers',
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'avatar',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'bio',
            type: 'textarea',
            required: true,
        },
        {
            name: 'social',
            type: 'group',
            fields: [
                {
                    name: 'x',
                    label: 'X (Twitter) URL',
                    type: 'text',
                },
                {
                    name: 'linkedin',
                    label: 'LinkedIn URL',
                    type: 'text',
                },
            ],
        },
    ],
};

export default Speakers;
