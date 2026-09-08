import { z } from 'zod'

export const threadIdParamSchema = z.object({
  id: z.uuid('Thread id inválido'),
})

export const sendMessageSchema = z.object({
  body: z.string().trim().min(1, 'El mensaje no puede estar vacío').max(2000, 'Máximo 2000 caracteres'),
  senderRole: z.enum(['recruiter', 'company', 'admin']).default('recruiter'),
})

export type SendMessageInput = z.infer<typeof sendMessageSchema>

export const listMessagesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(50),
})

export const createThreadSchema = z.object({
  jobRequestId: z.uuid('jobRequestId inválido'),
  applicationId: z.uuid('applicationId inválido').optional(),
})

export type CreateThreadInput = z.infer<typeof createThreadSchema>
