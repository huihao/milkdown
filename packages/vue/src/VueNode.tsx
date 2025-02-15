/* Copyright 2021, Milkdown by Mirone. */
/* eslint-disable vue/one-component-per-file */
import type { Ctx } from '@milkdown/core'
import type { Mark, Node } from '@milkdown/prose/model'
import type { Decoration, EditorView } from '@milkdown/prose/view'
import type { InjectionKey, Ref } from 'vue'
import { defineComponent, h, inject, provide } from 'vue'

export interface NodeContext<T extends Node | Mark = Node | Mark> {
  ctx: Ctx
  node: Ref<T>
  view: EditorView
  getPos: T extends Mark ? boolean : T extends Node ? () => number : boolean | (() => number)
  decorations: Ref<readonly Decoration[]>
}

export const nodeMetadata: InjectionKey<NodeContext> = Symbol('nodeMetadata')

export type UseNodeCtx = <T extends Node | Mark = Node | Mark>() => NodeContext<T>
export const useNodeCtx: UseNodeCtx = () => inject(nodeMetadata) as NodeContext<never>

export const VueNodeContainer = defineComponent<NodeContext & { as: string }>({
  name: 'MilkdownNodeContainer',
  setup: ({ node, view, getPos, decorations, ctx, as }, context) => {
    provide(nodeMetadata, {
      ctx,
      node,
      view,
      getPos,
      decorations,
    })
    return () => h(as, { 'data-view-container': true }, context.slots.default?.())
  },
})
VueNodeContainer.props = ['ctx', 'editor', 'node', 'view', 'getPos', 'decorations', 'as']

export const Content = defineComponent<{ isInline?: boolean }>({
  name: 'MilkdownContent',
  setup: ({ isInline }) => {
    return () => (isInline ? <span data-view-content /> : <div data-view-content />)
  },
})
Content.props = ['isInline']
