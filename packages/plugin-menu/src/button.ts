/* Copyright 2021, Milkdown by Mirone. */

import type { CmdKey, Ctx, Icon } from '@milkdown/core'
import { ThemeIcon, commandsCtx, getPalette } from '@milkdown/core'
import type { EditorView } from '@milkdown/prose/view'
import type { ThemeUtils } from '@milkdown/utils'

import type { CommonConfig } from './default-config'

export type ButtonConfig<T = any> = {
  type: 'button'
  icon: Icon
  active?: (view: EditorView) => boolean
  key: CmdKey<T> | string
  options?: T
} & CommonConfig

export const button = (utils: ThemeUtils, config: ButtonConfig, ctx: Ctx) => {
  const $button = document.createElement('button')
  $button.setAttribute('type', 'button')
  utils.themeManager.onFlush(() => {
    $button.className = 'button'

    const buttonStyle = utils.getStyle(({ css }) => {
      const palette = getPalette(utils.themeManager)
      return css`
                border: 0;
                box-sizing: unset;
                width: 28px;
                height: 28px;
                padding: 4px;
                margin: 8px;
                flex-shrink: 0;
                font-size: 14px;

                display: flex;
                justify-content: center;
                align-items: center;

                background-color: ${palette('surface')};
                color: ${palette('solid')};
                transition: color 0.4s ease-in-out, background-color 0.4s ease-in-out;

                cursor: pointer;

                &.active,
                &:hover {
                    background-color: ${palette('secondary', 0.12)};
                    color: ${palette('primary')};
                }

                &:disabled {
                    display: none;
                }

                .material-icons-outlined {
                    font-size: 24px;
                }
            `
    })

    if (buttonStyle)
      $button.classList.add(buttonStyle)
  })

  const $icon = utils.themeManager.get(ThemeIcon, config.icon)
  if ($icon) {
    const { label, dom } = $icon
    if (label) {
      $button.setAttribute('aria-label', label)
      $button.setAttribute('title', label)
    }
    $button.appendChild(dom)
  }
  else {
    $button.setAttribute('aria-label', config.icon)
    $button.setAttribute('title', config.icon)
    $button.textContent = config.icon
  }

  $button.addEventListener('mousedown', (e) => {
    e.preventDefault()
    e.stopPropagation()
    ctx.get(commandsCtx).call(config.key, config.options)
  })
  return $button
}
