import {defineArrayMember, defineField, defineType} from 'sanity'

export const activity = defineType({
  name: 'activity',
  title: 'Activity',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required().max(120)}),
    defineField({name: 'slug', title: 'URL slug', type: 'slug', options: {source: 'title', maxLength: 96}, validation: (rule) => rule.required()}),
    defineField({name: 'summary', title: 'Card summary', type: 'text', rows: 3, description: 'A concise description used on the Activities page and in search results.', validation: (rule) => rule.required().max(240)}),
    defineField({
      name: 'featuredImage', title: 'Featured image', type: 'image', options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string', description: 'Describe the image for visitors using screen readers.', validation: (rule) => rule.required()})],
    }),
    defineField({
      name: 'body', title: 'Article content', type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({type: 'image', options: {hotspot: true}, fields: [
          defineField({name: 'alt', title: 'Alternative text', type: 'string', validation: (rule) => rule.required()}),
          defineField({name: 'caption', title: 'Caption', type: 'string'}),
        ]}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'publishedAt', title: 'Publication date', type: 'datetime', initialValue: () => new Date().toISOString(), validation: (rule) => rule.required()}),
    defineField({
      name: 'category', title: 'Category', type: 'string',
      options: {list: [
        {title: 'Workshop', value: 'workshop'}, {title: 'Competition', value: 'competition'},
        {title: 'Team Support', value: 'team-support'}, {title: 'Partnership', value: 'partnership'},
        {title: 'MARZ News', value: 'news'},
      ], layout: 'dropdown'},
      initialValue: 'news', validation: (rule) => rule.required(),
    }),
    defineField({name: 'externalUrl', title: 'Optional external link', type: 'url', description: 'Use only when the activity should direct visitors to another website.', validation: (rule) => rule.uri({scheme: ['http', 'https']})}),
    defineField({name: 'seoTitle', title: 'SEO title', type: 'string', description: 'Optional. Defaults to the activity title.', validation: (rule) => rule.max(60)}),
    defineField({name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3, description: 'Optional. Defaults to the card summary.', validation: (rule) => rule.max(160)}),
  ],
  orderings: [{title: 'Publication date, newest', name: 'publishedAtDesc', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', subtitle: 'publishedAt', media: 'featuredImage'},
    prepare({title, subtitle, media}) {
      return {title, subtitle: subtitle ? new Intl.DateTimeFormat('en-US', {dateStyle: 'medium'}).format(new Date(subtitle)) : 'No publication date', media}
    },
  },
})
