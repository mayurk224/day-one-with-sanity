import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import { DoorsOpenInput } from './components/DoorOpenInput'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {
      name: 'event',
      title: 'Event',
      default: true,
    },
    {
      name: 'venue',
      title: 'Venue',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: ['event', 'venue'],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Slug is required'),
      hidden: ({document}) => !document?.name,
      group: 'event',
    }),
    defineField({
      name: 'eventType',
      type: 'string',
      options: {
        list: ['in-personal', 'virtual'],
        layout: 'radio',
      },
      group: 'event',
    }),
    defineField({
      name: 'date',
      type: 'datetime',
      group: 'event',
    }),
    defineField({
      name: 'doorsOpen',
      description: 'Number of minuts before the event starts',
      type: 'number',
      initialValue: 60,
      group: 'event',
      components: {
        input: DoorsOpenInput
      },
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      to: [{type: 'venue'}],
      group: 'venue',
      readOnly: ({document}) => document?.eventType === 'virtual',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (value && context?.document?.eventType === 'virtual') {
            return 'A virtual event should not have a venue.'
          }
          return true
        }),
    }),
    defineField({
      name: 'headline',
      type: 'reference',
      to: [{type: 'artist'}],
      group: 'event',
    }),
    defineField({
      name: 'image',
      type: 'image',
      group: 'venue',
    }),
    defineField({
      name: 'details',
      type: 'array',
      of: [{type: 'block'}],
      group: 'venue',
    }),
    defineField({
      name: 'tickets',
      type: 'url',
      group: 'event',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      artist: 'headline.name',
      venue: 'venue.name',
      date: 'date',
      image: 'image',
    },
    prepare({name, venue, artist, date, image}) {
        const nameFormatted = name || 'Untitled event'
        const dateFormatted = date
          ? new Date(date).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })
          : 'No date'
    
        return {
          title: artist ? `${nameFormatted} (${artist})` : nameFormatted,
          subtitle: venue ? `${dateFormatted} at ${venue}` : dateFormatted,
          media: image || CalendarIcon,
        }
      },
  },
})
