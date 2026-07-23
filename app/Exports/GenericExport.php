<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class GenericExport implements FromCollection, WithHeadings
{
    protected $data;
    protected $headings;

    public function __construct(array $data)
    {
        $this->data = collect($data);
    }

    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        if (isset($this->data[0]) && !is_array($this->data[0])) {
            return [];
        }
        $first = $this->data->first();
        if (!empty($first)) {
            return $first;
        }
        return [];
    }
}
