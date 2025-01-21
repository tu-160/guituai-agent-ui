import type { Component } from 'vue';
import type { ComponentType } from './types/index';

/**
 * Component list, register here to setting it in the form
 */
import { StrengthMeter } from '@/components/StrengthMeter';
import { CountdownInput } from '@/components/CountDown';

const componentMap = new Map<ComponentType, Component>();

componentMap.set('StrengthMeter', StrengthMeter);
componentMap.set('InputCountDown', CountdownInput);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
