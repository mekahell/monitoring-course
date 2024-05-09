function add_timestamp(tag, timestamp, record)
    new_record = record
    new_record['time'] = os.date("!%Y-%m-%dT%TZ",timestamp)
    return 1, timestamp, new_record
end