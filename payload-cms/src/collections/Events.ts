import { CollectionConfig } from 'payload/types';

const Events: CollectionConfig = {
    slug: 'events',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'chapter', 'date'],
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
            required: true,
        },
        {
            name: 'chapter',
            type: 'select',
            options: ['Bangalore', 'Hyderabad', 'Mumbai', 'Other'],
            required: true,
        },
        {
            name: 'date',
            type: 'date',
            required: true,
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
        },
        {
            name: 'venue',
            type: 'group',
            fields: [
                {
                    name: 'type',
                    type: 'radio',
                    options: ['physical', 'online'],
                    defaultValue: 'physical',
                    required: true,
                },
                {
                    name: 'details',
                    type: 'text',
                    label: 'Venue Details (Address or URL)',
                    required: true,
                },
                {
                    name: 'googleMapsLink',
                    type: 'text',
                    label: 'Google Maps Embed URL',
                    admin: {
                        condition: (_, siblingData) => siblingData.type === 'physical',
                    },
                },
            ],
        },
        {
            name: 'capacity',
            type: 'number',
            defaultValue: 100,
            min: 0,
        },
        {
            name: 'tickets',
            type: 'array',
            fields: [
                {
                    name: 'tier',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'price',
                    type: 'number',
                    required: true,
                    defaultValue: 0,
                },
            ],
        },
        {
            name: 'coverImage',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'speakers',
            type: 'relationship',
            relationTo: 'speakers',
            hasMany: true,
        },
        {
            name: 'organizer',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
    ],
};

export default Events;
