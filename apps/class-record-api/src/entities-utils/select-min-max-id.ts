import { SelectQueryBuilder } from 'typeorm';
import { RangeDto } from '../dto/range.dto';

export async function getIntIdRangeForQuery<T>(
	build: SelectQueryBuilder<T>,
	IdField: string,
	minRank: number,
	maxRank: number,
): Promise<RangeDto> {
	const queryResult = await build
		.select(`dense_rank() over (order by ${IdField})`, 'denserank')
		.addSelect(IdField, 'id')
		.orderBy(IdField)
		.getRawMany();
	const start = parseInt(
		queryResult.find((r) => parseInt(r.denserank) >= minRank)?.id || 0,
	);
	const end = parseInt(
		queryResult.findLast((r) => parseInt(r.denserank) <= maxRank)?.id || 0,
	);

	return new RangeDto({ start, end });
}
