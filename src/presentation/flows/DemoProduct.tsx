import type { DemoFlowId } from '../engine/types';
import {
  CreateActivityDemo,
  CreateObjectDemo,
  DocumentTemplatesDemo,
  SingleTaskDemo,
} from './DesktopDemos';
import { ManagerAppDemo } from './ManagerAppDemo';
import { PerformerRegistrationDemo } from './PerformerRegistrationDemo';
import { PerformerSelectionDemo } from './PerformerSelectionDemo';
import { RegistrationDemo } from './RegistrationDemo';
import { TaskPaymentDemo } from './TaskPaymentDemo';

export function DemoProduct({ flowId }: { flowId: DemoFlowId }) {
  switch (flowId) {
    case 'registration':
      return <RegistrationDemo />;
    case 'performer-registration':
      return <PerformerRegistrationDemo />;
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
    case 'performer-selection':
      return <PerformerSelectionDemo />;
    case 'task-payment':
      return <TaskPaymentDemo />;
  }
}
