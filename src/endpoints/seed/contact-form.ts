import { RequiredDataFromCollectionSlug } from 'payload'

export const contactForm: RequiredDataFromCollectionSlug<'forms'> = {
  confirmationMessage: {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'پیام شما با موفقیت ارسال شد.',
              version: 1,
            },
          ],
          direction: 'rtl',
          format: '',
          indent: 0,
          tag: 'h2',
          version: 1,
        },
      ],
      direction: 'rtl',
      format: '',
      indent: 0,
      version: 1,
    },
  },
  confirmationType: 'message',
  emails: [
    {
      emailFrom: '"کلینیک دکتر رنجبر" <noreply@example.com>',
      emailTo: '{{email}}',
      message: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'پیام شما دریافت شد. به‌زودی با شما تماس می‌گیریم.',
                  version: 1,
                },
              ],
              direction: 'rtl',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'rtl',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      subject: 'پیام شما دریافت شد',
    },
  ],
  fields: [
    {
      name: 'first-name',
      blockName: 'first-name',
      blockType: 'text',
      label: 'نام',
      required: true,
      width: 50,
    },
    {
      name: 'last-name',
      blockName: 'last-name',
      blockType: 'text',
      label: 'نام خانوادگی',
      required: true,
      width: 50,
    },
    {
      name: 'email',
      blockName: 'email',
      blockType: 'email',
      label: 'ایمیل',
      required: true,
      width: 100,
    },
    {
      name: 'company',
      blockName: 'company',
      blockType: 'text',
      label: 'سازمان / شرکت',
      required: false,
      width: 100,
    },
    {
      name: 'message',
      blockName: 'message',
      blockType: 'textarea',
      label: 'پیام',
      required: true,
      width: 100,
    },
    {
      name: 'terms',
      blockName: 'terms',
      blockType: 'checkbox',
      label: 'با قوانین و شرایط و حریم خصوصی موافقم',
      required: true,
      width: 100,
    },
  ],
  redirect: undefined,
  submitButtonLabel: 'ارسال',
  title: 'فرم تماس',
}
