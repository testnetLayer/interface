import { SharedEventName } from '@uniswap/analytics-events'
import React from 'react'
import { SvgProps } from 'react-native-svg'
import { useAppDispatch } from 'src/app/hooks'
import { Flex, IconProps, Text, TouchableArea, useSporeColors } from 'ui/src'
import CopyIcon from 'ui/src/assets/icons/copy-sheets.svg'
import { iconSizes } from 'ui/src/theme'
import Trace from 'uniswap/src/features/telemetry/Trace'
import { ElementName, ElementNameType } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import { MobileScreens } from 'uniswap/src/types/screens/mobile'
import { openUri } from 'uniswap/src/utils/linking'
import { pushNotification } from 'wallet/src/features/notifications/slice'
import { AppNotificationType, CopyNotificationType } from 'wallet/src/features/notifications/types'
import { setClipboard } from 'wallet/src/utils/clipboard'

export enum LinkButtonType {
  Copy = 'copy',
  Link = 'link',
}

export function LinkButton({
  buttonType,
  label,
  Icon,
  element,
  openExternalBrowser = false,
  isSafeUri = false,
  value,
}: {
  buttonType: LinkButtonType
  label: string
  Icon?: React.FC<SvgProps & { size?: IconProps['size'] }>
  element: ElementNameType
  openExternalBrowser?: boolean
  isSafeUri?: boolean
  value: string
}): JSX.Element {
  const dispatch = useAppDispatch()
  const colors = useSporeColors()

  const copyValue = async (): Promise<void> => {
    await setClipboard(value)
    dispatch(
      pushNotification({
        type: AppNotificationType.Copied,
        copyType: CopyNotificationType.Address,
      }),
    )
    sendAnalyticsEvent(SharedEventName.ELEMENT_CLICKED, {
      element: ElementName.CopyAddress,
      screen: MobileScreens.TokenDetails,
    })
  }

  const onPress = async (): Promise<void> => {
    if (buttonType === LinkButtonType.Link) {
      await openUri(value, openExternalBrowser, isSafeUri)
    } else {
      await copyValue()
    }
  }

  return (
    <Trace logPress element={element}>
      <TouchableArea
        hapticFeedback
        backgroundColor="$surface2"
        borderRadius="$rounded20"
        px="$spacing12"
        py="$spacing8"
        testID={element}
        onPress={onPress}
      >
        <Flex centered row shrink gap="$spacing8" width="auto">
          {Icon && <Icon color={colors.neutral1.get()} size="$icon.16" />}
          <Text $short={{ variant: 'buttonLabel4' }} color="$neutral1" variant="buttonLabel3">
            {label}
          </Text>
          {buttonType === LinkButtonType.Copy && (
            <CopyIcon color={colors.neutral2.get()} height={iconSizes.icon16} width={iconSizes.icon16} />
          )}
        </Flex>
      </TouchableArea>
    </Trace>
  )
}
