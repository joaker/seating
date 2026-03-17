import type { AnnealConfig, AnnealSnapshot, BatchConfig } from './types';
export declare function annealAsync<S>(initialState: S, initialEnergy: number, config: AnnealConfig<S>, batchConfig: BatchConfig<S>): Promise<AnnealSnapshot<S>>;
//# sourceMappingURL=anneal-async.d.ts.map