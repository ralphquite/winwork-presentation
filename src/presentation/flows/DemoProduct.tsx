import type { DemoFlowId } from '../engine/types';
import {
  CreateActivityDemo,
  CreateObjectDemo,
  DocumentTemplatesDemo,
  SingleTaskDemo,
} from './DesktopDemos';
import { ManagerAppDemo } from './ManagerAppDemo';

export function DemoProduct({ flowId }: { flowId: DemoFlowId }) {
  switch (flowId) {
    case 'create-object':
      return <CreateObjectDemo />;
    case 'manager-app':
      return <ManagerAppDemo />;
    case 'create-activity':
      return <CreateActivityDemo />;
    case 'document-templates':
      return <DocumentTemplatesDemo />;
    case 'single-task':
      return <SingleTaskDemo />;
  }
}
