/** v-copy 复制某个值至剪贴板 接收参数：string类型/Ref<string>类型/Reactive<string>类型 */
import { type Directive, type DirectiveBinding, createVNode, render } from 'vue';
import { $t } from '@/locales';
const { copy, isSupported } = useClipboard();

interface ElType extends HTMLElement {
  text: string | number;
  handleClick: any;
  vNode?: VNode;
}

const directive: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    // 双击触发复制
    el.title = $t('common.copy');
    if (binding.modifiers.dblclick) {
      el.addEventListener('dblclick', () => handleClick(el.textContent));
      el.style.cursor = 'copy';
    }
    // 点击icon触发复制
    else if (binding.modifiers.icon) {
      el.setAttribute('class', 'icon-park-outline--copy');
      el.addEventListener('click', () => handleClick(el.textContent));
      el.style.cursor = 'copy';
    }
    // 单击触发复制
    else {
      el.addEventListener('click', () => handleClick(el.textContent));
      el.style.cursor = 'copy';
    }
  },
  updated(el: ElType, binding: DirectiveBinding) {
    el.text = binding.value;
  },
  beforeUnmount(el: ElType) {
    render(null, el);
    el.removeEventListener('click', el.handleClick);
  }
};

async function handleClick(text: any) {
  if (!isSupported) {
    window.$message?.error($t('common.copyNotSupported'));
    return;
  }
  await copy(text);
  window.$message?.success($t('common.copySuccess'));
}

export default directive;
