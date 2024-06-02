import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { IExceptionsFormatter } from './exception.module';

export interface ExceptionsModuleOptions {
    formatters: IExceptionsFormatter[];
}
export type ExceptionsModuleAsyncOptions = Pick<ModuleMetadata, 'imports'> &
    Pick<FactoryProvider<ExceptionsModuleOptions>, 'useFactory' | 'inject'>;
